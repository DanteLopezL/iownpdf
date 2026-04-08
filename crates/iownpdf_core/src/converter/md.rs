use std::path::{Path, PathBuf};

use crate::{converter::FileConverter, errors::IownPdfError, utils::validator::validate_input};

/// Converter for Markdown files to PDF.
#[derive(Debug)]
pub struct MdConverter {
    file: PathBuf,
}

impl FileConverter for MdConverter {
    fn new(file: &Path) -> Result<Self, IownPdfError> {
        validate_input(file, "md")?;
        Ok(Self {
            file: file.to_path_buf(),
        })
    }

    fn to_pdf(self) -> Result<PathBuf, IownPdfError> {
        let md_content = std::fs::read_to_string(&self.file).map_err(IownPdfError::Io)?;
        let output_path = self.file.with_extension("pdf");
        let output_str = output_path.to_str().ok_or_else(|| {
            IownPdfError::ConversionFailed("output path contains invalid UTF-8".to_string())
        })?;

        markdown2pdf::parse_into_file(
            md_content,
            output_str,
            markdown2pdf::config::ConfigSource::Default,
            None,
        )
        .map_err(|e| IownPdfError::ConversionFailed(e.to_string()))?;

        Ok(output_path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_md_converter_new_success() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.md");
        fs::write(&file_path, "# Hello").unwrap();
        assert!(MdConverter::new(&file_path).is_ok());
    }

    #[test]
    fn test_md_converter_new_file_not_found() {
        let result = MdConverter::new(Path::new("/nonexistent/file.md"));
        assert!(matches!(result.unwrap_err(), IownPdfError::FileNotFound(_)));
    }

    #[test]
    fn test_md_converter_new_wrong_extension() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.txt");
        fs::write(&file_path, "content").unwrap();
        let result = MdConverter::new(&file_path);
        assert!(matches!(
            result.unwrap_err(),
            IownPdfError::UnsupportedFormat { .. }
        ));
    }

    #[test]
    fn test_md_converter_new_wrong_md_extension() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.markdown");
        fs::write(&file_path, "# Hello").unwrap();
        assert!(MdConverter::new(&file_path).is_err());
    }

    #[test]
    fn test_to_pdf_produces_file() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.md");
        fs::write(&file_path, "# Hello\n\nWorld").unwrap();
        let output = MdConverter::new(&file_path).unwrap().to_pdf().unwrap();
        assert!(output.exists());
        assert_eq!(output.extension().unwrap(), "pdf");
    }

    #[test]
    fn test_to_pdf_output_is_nonempty() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.md");
        fs::write(&file_path, "# Hello\n\nWorld").unwrap();
        let output = MdConverter::new(&file_path).unwrap().to_pdf().unwrap();
        assert!(std::fs::metadata(&output).unwrap().len() > 0);
    }

    #[test]
    fn test_to_pdf_output_path_matches_input() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("document.md");
        fs::write(&file_path, "content").unwrap();
        let output = MdConverter::new(&file_path).unwrap().to_pdf().unwrap();
        assert_eq!(output, dir.path().join("document.pdf"));
    }
}
