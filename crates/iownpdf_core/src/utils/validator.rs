use std::path::Path;

use crate::errors::IownPdfError;

/// Validates input file for conversion.
///
/// Checks that the file exists and has the expected extension.
/// Extension matching is case-sensitive.
pub fn validate_input(file: &Path, expected_ext: &str) -> Result<(), IownPdfError> {
    // Check file existence first
    if !file.try_exists().map_err(IownPdfError::Io)? {
        return Err(IownPdfError::FileNotFound(file.to_path_buf()));
    }

    // Validate extension
    let extension = file.extension().ok_or_else(|| {
        IownPdfError::ConversionFailed(format!("file has no extension: {file:?}"))
    })?;

    if extension != expected_ext {
        return Err(IownPdfError::UnsupportedFormat {
            expected: expected_ext.to_string(),
            got: extension.to_string_lossy().to_string(),
        });
    }

    Ok(())
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
}
