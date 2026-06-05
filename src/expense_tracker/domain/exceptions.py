class DomainValidationError(ValueError):
    """Raised when domain rules are violated."""


class RepositoryError(RuntimeError):
    """Raised when repository operations fail."""
