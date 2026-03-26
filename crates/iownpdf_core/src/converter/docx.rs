use std::path::{Path, PathBuf};

use crate::{errors::IownPdfError, utils::validator::validate_input};

#[derive(Debug)]
pub struct DocxConverter {
    file: PathBuf,
}

impl DocxConverter {
    pub fn new(file: &Path) -> Result<Self, IownPdfError> {
        validate_input(file, "docx")?;
        Ok(Self {
            file: file.to_path_buf(),
        })
    }

    pub fn to_pdf(self) -> Result<Vec<u8>, IownPdfError> {
        todo!()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_docx_converter_new_success() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.docx");
        fs::write(&file_path, b"").unwrap();

        let result = DocxConverter::new(&file_path);
        assert!(result.is_ok());
    }

    #[test]
    fn test_docx_converter_new_file_not_found() {
        let file_path = Path::new("/nonexistent/file.docx");

        let result = DocxConverter::new(file_path);
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), IownPdfError::FileNotFound(_)));
    }

    #[test]
    fn test_docx_converter_new_wrong_extension() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.txt");
        fs::write(&file_path, "content").unwrap();

        let result = DocxConverter::new(&file_path);
        assert!(result.is_err());
        assert!(matches!(
            result.unwrap_err(),
            IownPdfError::ConversionFailed(_)
        ));
    }
}
