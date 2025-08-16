-- Extra indexes that often help under load
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_tier_book_access ON tier_book_access(tier_id, book_id, book_details_id);
CREATE INDEX IF NOT EXISTS idx_user_book_access_log_user ON user_book_access_log(user_id);