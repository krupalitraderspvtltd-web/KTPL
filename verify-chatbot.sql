SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'ChatSession',
    'ChatMessage',
    'ChatLead',
    'ChatbotKnowledge'
  )
ORDER BY table_name;