def get_authenticated_user(app):
    try:
        user = app.authentication().get_current_user()

        if not user:
            return None

        if isinstance(user, dict) and "content" in user:
            user = user["content"]

        return user

    except Exception:
        return None
