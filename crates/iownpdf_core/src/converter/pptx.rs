use std::path::{Path, PathBuf};

use crate::{
    converter::FileConverter,
    errors::IownPdfError,
    utils::validator::{resolve_output_path, validate_input},
};

/// Converter for PPTX files to PDF.
#[derive(Debug)]
pub struct PptxConverter {
    file: PathBuf,
}

impl FileConverter for PptxConverter {
    fn new(file: &Path) -> Result<Self, IownPdfError> {
        validate_input(file, "pptx")?;
        Ok(Self {
            file: file.to_path_buf(),
        })
    }

    fn to_pdf(self, output_dir: Option<&Path>) -> Result<PathBuf, IownPdfError> {
        let output_path = resolve_output_path(&self.file, output_dir)?;

        let result = office2pdf::convert(&self.file)
            .map_err(|e| IownPdfError::ConversionFailed(e.to_string()))?;

        std::fs::write(&output_path, result.pdf).map_err(IownPdfError::Io)?;

        Ok(output_path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_pptx_converter_new_success() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.pptx");
        fs::write(&file_path, b"").unwrap();

        let result = PptxConverter::new(&file_path);
        assert!(result.is_ok());
    }

    #[test]
    fn test_pptx_converter_new_file_not_found() {
        let file_path = Path::new("/nonexistent/file.pptx");

        let result = PptxConverter::new(file_path);
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), IownPdfError::FileNotFound(_)));
    }

    #[test]
    fn test_pptx_converter_new_wrong_extension() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.txt");
        fs::write(&file_path, "content").unwrap();

        let result = PptxConverter::new(&file_path);
        assert!(result.is_err());
        assert!(matches!(
            result.unwrap_err(),
            IownPdfError::UnsupportedFormat { .. }
        ));
    }

    #[test]
    fn test_pptx_converter_new_wrong_pptx_extension() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.ppt");
        fs::write(&file_path, b"").unwrap();
        assert!(PptxConverter::new(&file_path).is_err());
    }

    #[test]
    fn test_pptx_converter_new_case_sensitive() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.PPTX");
        fs::write(&file_path, b"").unwrap();
        assert!(PptxConverter::new(&file_path).is_err());
    }

    #[test]
    fn test_pptx_converter_new_no_extension() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("testfile");
        fs::write(&file_path, b"").unwrap();
        assert!(PptxConverter::new(&file_path).is_err());
    }

    #[test]
    fn test_pptx_converter_new_multiple_extensions() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.tar.pptx");
        fs::write(&file_path, b"").unwrap();
        assert!(PptxConverter::new(&file_path).is_ok());
    }
}
