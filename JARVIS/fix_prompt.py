with open("main.py", "r") as f:
    main_code = f.read()

main_code = main_code.replace(
    "1. Initialize/Save User Biodata: `[SAVE_MEMORY: {{\"name\": \"...\", \"role\": \"...\", \"organization\": \"...\"}}]` (if they provide details, update fields)",
    "1. Initialize/Save User Biodata: `[SAVE_MEMORY: {{\"name\": \"...\", \"role\": \"...\", \"organization\": \"...\"}}]` (CRITICAL: if they provide ANY details, facts, or preferences about themselves or others, you MUST proactively use this to memorize it)"
)

with open("main.py", "w") as f:
    f.write(main_code)
