-- Supprimer tous les signalements
DELETE FROM reports;

-- Remettre à zéro tous les compteurs de points et statistiques des utilisateurs
UPDATE users SET 
  points_himpact = 0,
  experience_points = 0,
  reports_count = 0,
  cleanups_count = 0,
  level_current = 1,
  streak_days = 0,
  badges = '[]'::jsonb;

-- Supprimer tous les achievements obtenus par les utilisateurs
DELETE FROM user_achievements;

-- Supprimer les rapports en attente
DELETE FROM pending_reports;