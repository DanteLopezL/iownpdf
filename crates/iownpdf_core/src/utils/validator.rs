use std::path::{Path, PathBuf};

use crate::errors::IownPdfError;

/// Validates input file for conversion.
///
/// Checks that the file exists and has the expected extension.
/// Extension matching is case-sensitive.
pub fn validate_input(file: &Path, expected_ext: &str) -> Result<(), IownPdfError> {
    validate_input_any(file, &[expected_ext])
}

/// Validates input file for conversion against any allowed extension.
pub fn validate_input_any(file: &Path, expected_exts: &[&str]) -> Result<(), IownPdfError> {
    // Check file existence first
    if !file.try_exists().map_err(IownPdfError::Io)? {
        return Err(IownPdfError::FileNotFound(file.to_path_buf()));
    }

    // Validate extension
    let extension = file.extension().ok_or_else(|| {
        IownPdfError::ConversionFailed(format!("file has no extension: {file:?}"))
    })?;

    if !expected_exts.iter().any(|expected| extension == *expected) {
        return Err(IownPdfError::UnsupportedFormat {
            expected: expected_exts.join(" or ."),
            got: extension.to_string_lossy().to_string(),
        });
    }

    Ok(())
}

/// Resolves the PDF output path for an input file.
///
/// When `output_dir` is `None`, the output sits alongside the input with a
/// `.pdf` extension. When `Some(dir)`, the PDF takes the input's file name
/// (with the extension swapped to `.pdf`) inside `dir`. `dir` must already
/// exist and be a directory.
pub fn resolve_output_path(
    input: &Path,
    output_dir: Option<&Path>,
) -> Result<PathBuf, IownPdfError> {
    match output_dir {
        None => Ok(input.with_extension("pdf")),
        Some(dir) => {
            if !dir.is_dir() {
                return Err(IownPdfError::InvalidOutputDir(dir.to_path_buf()));
            }
            let pdf_name = input
                .with_extension("pdf")
                .file_name()
                .map(|n| n.to_owned())
                .ok_or_else(|| {
                    IownPdfError::ConversionFailed(format!(
                        "input path has no file name: {input:?}"
                    ))
                })?;
            Ok(dir.join(pdf_name))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_validate_input_success() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.md");
        fs::write(&file_path, "# Hello").unwrap();

        let result = validate_input(&file_path, "md");
        assert!(result.is_ok());
    }

    #[test]
    fn test_validate_input_any_success() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.markdown");
        fs::write(&file_path, "# Hello").unwrap();

        let result = validate_input_any(&file_path, &["md", "markdown"]);
        assert!(result.is_ok());
    }

    #[test]
    fn test_validate_input_file_not_found() {
        let file_path = Path::new("/nonexistent/file.md");

        let result = validate_input(file_path, "md");
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), IownPdfError::FileNotFound(_)));
    }

    #[test]
    fn test_validate_input_wrong_extension() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.txt");
        fs::write(&file_path, "content").unwrap();

        let result = validate_input(&file_path, "md");
        assert!(result.is_err());
        assert!(matches!(
            result.unwrap_err(),
            IownPdfError::UnsupportedFormat { .. }
        ));
    }

    #[test]
    fn test_validate_input_case_sensitive() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.MD");
        fs::write(&file_path, "# Hello").unwrap();

        let result = validate_input(&file_path, "md");
        assert!(result.is_err());
    }

    #[test]
    fn test_validate_input_no_extension() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("testfile");
        fs::write(&file_path, "content").unwrap();

        let result = validate_input(&file_path, "md");
        assert!(result.is_err());
    }

    #[test]
    fn test_validate_input_multiple_extensions() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.tar.gz");
        fs::write(&file_path, "content").unwrap();

        // Should only check the last extension
        let result = validate_input(&file_path, "gz");
        assert!(result.is_ok());

        let result = validate_input(&file_path, "tar");
        assert!(result.is_err());
    }

    #[test]
    fn test_resolve_output_path_no_dir_falls_back_to_sibling() {
        let input = Path::new("/tmp/some/file.md");
        let got = resolve_output_path(input, None).unwrap();
        assert_eq!(got, Path::new("/tmp/some/file.pdf"));
    }

    #[test]
    fn test_resolve_output_path_with_dir_joins_pdf_name() {
        let dir = tempdir().unwrap();
        let input = Path::new("/elsewhere/report.docx");

        let got = resolve_output_path(input, Some(dir.path())).unwrap();
        assert_eq!(got, dir.path().join("report.pdf"));
    }

    #[test]
    fn test_resolve_output_path_preserves_multi_dot_stem() {
        let dir = tempdir().unwrap();
        let input = Path::new("/in/my.draft.docx");

        let got = resolve_output_path(input, Some(dir.path())).unwrap();
        assert_eq!(got, dir.path().join("my.draft.pdf"));
    }

    #[test]
    fn test_resolve_output_path_rejects_missing_dir() {
        let input = Path::new("/in/file.md");
        let missing = Path::new("/this/does/not/exist/anywhere");

        let err = resolve_output_path(input, Some(missing)).unwrap_err();
        assert!(matches!(err, IownPdfError::InvalidOutputDir(_)));
    }

    #[test]
    fn test_resolve_output_path_rejects_file_as_dir() {
        let dir = tempdir().unwrap();
        let file_as_dir = dir.path().join("not-a-dir.txt");
        fs::write(&file_as_dir, "x").unwrap();
        let input = Path::new("/in/file.md");

        let err = resolve_output_path(input, Some(&file_as_dir)).unwrap_err();
        assert!(matches!(err, IownPdfError::InvalidOutputDir(_)));
    }
}
