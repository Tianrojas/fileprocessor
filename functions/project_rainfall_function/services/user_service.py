def format_user(user):
    return {
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
        "email": user.get("email_id"),
        "role": user.get("role_details", {}).get("role_name")
    }