from flask import request, current_app
import os
class users:
    def __init__(self):
        # No DB connection needed for file-based storage
        pass

    def get_info(self):
        # Read user info from users_info.txt
        try:
            if not os.path.exists('users_info.txt'):
                return []
            with open('users_info.txt', 'r', encoding='utf-8') as f:
                lines = f.readlines()
            # Optionally parse lines into dicts
            users_list = []
            for line in lines:
                parts = line.strip().split(', ')
                user_dict = {}
                for part in parts:
                    if ':' in part:
                        k, v = part.split(':', 1)
                        user_dict[k.strip()] = v.strip()
                if user_dict:
                    users_list.append(user_dict)
            return users_list
        except Exception as e:
            print(e)
            return None

