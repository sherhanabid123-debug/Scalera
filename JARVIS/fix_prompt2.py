with open("main.py", "r") as f:
    main_code = f.read()

main_code = main_code.replace(
    "19. Send WhatsApp: `[WHATSAPP: Contact Name | Message]` (Use this to orchestrate the desktop WhatsApp app to send a message)",
    "19. Send WhatsApp: `[WHATSAPP: Contact Name | Message]` (Use this to orchestrate the desktop WhatsApp app to send a message)\n20. Quit App: `[QUIT]` (Use this to say goodbye and shut down Ram Singh completely)\n21. Sleep/Standby: `[SLEEP]` (Use this to stop listening and enter standby mode)"
)

with open("main.py", "w") as f:
    f.write(main_code)
