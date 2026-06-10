def format_user(user):
    if not user:
        return {
            "first_name": "",
            "last_name": "",
            "email": "",
            "role": ""
        }

    # Normalizar estructura del user
    user_data = user.get("content", user)

    return {
        "first_name": user_data.get("first_name", ""),
        "last_name": user_data.get("last_name", ""),
        "email": user_data.get("email_id", ""),
        "role": user_data.get("role_details", {}).get("role_name", "")
    }
