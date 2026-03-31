use std::{fmt, io, path::PathBuf};

#[derive(Debug)]
pub enum IownPdfError {
    FileNotFound(PathBuf),
    UnsupportedFormat { expected: String, got: String },
    MissingExtension(PathBuf),
    ConversionFailed(String),
    Io(io::Error),
}

impl fmt::Display for IownPdfError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::FileNotFound(p) => write!(f, "file not found: {}", p.display()),
            Self::UnsupportedFormat { expected, got } => {
                write!(f, "unsupported format: expected .{expected}, got .{got}")
            }
            Self::MissingExtension(p) => write!(f, "missing extension: {}", p.display()),
            Self::ConversionFailed(msg) => write!(f, "conversion failed: {msg}"),
            Self::Io(e) => write!(f, "io error: {e}"),
        }
    }
}

impl std::error::Error for IownPdfError {
    // optional: chain the source for Io variant
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Self::Io(e) => Some(e),
            _ => None,
        }
    }
}

// this is what makes ? work on io::Error
impl From<io::Error> for IownPdfError {
    fn from(e: io::Error) -> Self {
        Self::Io(e)
    }
}
