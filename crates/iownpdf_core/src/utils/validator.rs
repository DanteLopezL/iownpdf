use std::path::Path;

use crate::errors::IownPdfError;

/// Validates input file for conversion.
///
/// Checks that the file exists and has the expected extension.
pub fn validate_input(file: &Path, extension: &str) -> Result<(), IownPdfError> {
    if !file.exists() {
        return Err(IownPdfError::FileNotFound(file.to_path_buf()));
    }

    if !file.extension().is_some_and(|e| e == extension) {
        return Err(IownPdfError::ConversionFailed(format!(
            "expected .{extension} file, got {:?}",
            file
        )));
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
            IownPdfError::ConversionFailed(_)
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
