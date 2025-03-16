import imaplib
import email
import re
import pandas as pd
from openpyxl import load_workbook
from dotenv import load_dotenv
import os


load_dotenv()


EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
IMAP_SERVER = os.getenv("IMAP_SERVER")


mail = imaplib.IMAP4_SSL(IMAP_SERVER)
mail.login(EMAIL_USER, EMAIL_PASS)
mail.select("inbox")  

# Search for emails from the specific sender
status, messages = mail.search(None, 'FROM "dimagidangal01@gmail.com"')  
email_ids = messages[0].split()


data_list = []


for email_id in email_ids:
    status, msg_data = mail.fetch(email_id, '(RFC822)')
    for response_part in msg_data:
        if isinstance(response_part, tuple):
            msg = email.message_from_bytes(response_part[1])
            subject = msg["subject"]
            sender = msg["from"]
            email_body = ""

            # Extract email content
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    if content_type == "text/plain":
                        email_body = part.get_payload(decode=True).decode(errors='ignore')
            else:
                email_body = msg.get_payload(decode=True).decode(errors='ignore')

            # Extract Slot, Name, Score, and Duration using Regex
            name_slot_match = re.search(r"(\w+\s\w+) of Slot (\d+)", email_body)
            score_match = re.search(r"📊 Score:\s*(\d+)/\d+", email_body)
            duration_match = re.search(r"⏳Quiz Duration\s*:\s*(\d+m \d+s)", email_body)

            name = name_slot_match.group(1) if name_slot_match else "Unknown"
            slot = name_slot_match.group(2) if name_slot_match else "Unknown"
            score = score_match.group(1) if score_match else "0"
            duration = duration_match.group(1) if duration_match else "0m 0s"

            data_list.append([slot, name, score, duration])


mail.logout()


df = pd.DataFrame(data_list, columns=["Slot", "Name", "Score", "Duration"])


file_path = "quiz_results.xlsx"

try:
    existing_data = pd.read_excel(file_path)
    df = pd.concat([existing_data, df], ignore_index=True)
except FileNotFoundError:
    pass  # No existing file, create a new one

# Save DataFrame to Excel
df.to_excel(file_path, index=False, engine="openpyxl")

print("✅ Data successfully appended to Excel!")
