use std::{fmt, path::PathBuf};

#[derive(Debug)]
pub enum IownPdfError {
    FileNotFound(PathBuf),
    ConversionFailed(String),
}

impl fmt::Display for IownPdfError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::FileNotFound(p) => write!(f, "file not found: {}", p.display()),
            Self::ConversionFailed(msg) => write!(f, "conversion failed: {msg}"),
        }
    }
}

impl std::error::Error for IownPdfError {}
