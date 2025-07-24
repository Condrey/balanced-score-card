-- Seed sample data for BSC system
-- This script inserts sample employees and BSC data for testing

-- Insert sample employees
INSERT INTO employees (id, employee_number, name, job_title, salary_scale) VALUES
('emp_001', 'EMP001', 'John Doe', 'Senior Program Officer', 'Scale 12'),
('emp_002', 'EMP002', 'Jane Smith', 'Director of Operations', 'Scale 15'),
('emp_003', 'EMP003', 'Michael Johnson', 'Finance Manager', 'Scale 13'),
('emp_004', 'EMP004', 'Sarah Wilson', 'HR Specialist', 'Scale 11'),
('emp_005', 'EMP005', 'David Brown', 'IT Coordinator', 'Scale 10')
ON CONFLICT (employee_number) DO NOTHING;

-- Insert sample BSC
INSERT INTO bscs (
    id, 
    year, 
    supervisee_id, 
    supervisor_id, 
    mandate, 
    vision, 
    mission, 
    goal,
    ndp_programmes,
    departmental_mandate,
    strategic_objectives,
    performance_score,
    behavioral_score,
    overall_score,
    performance_level
) VALUES (
    'bsc_001',
    2024,
    'emp_001',
    'emp_002',
    'To promote sustainable development and improve quality of life for all citizens through effective governance and service delivery.',
    'A prosperous and equitable society where all citizens have access to quality services and opportunities for growth.',
    'To deliver excellent public services through innovation, transparency, and citizen engagement while promoting sustainable development.',
    'Achieve 90% citizen satisfaction with public services by 2025.',
    ARRAY['Economic Development', 'Social Services', 'Infrastructure Development', 'Environmental Protection'],
    'To coordinate and implement development programs that enhance economic growth and social welfare in the region.',
    ARRAY['Improve service delivery efficiency by 25%', 'Increase citizen engagement by 40%', 'Reduce processing time by 30%', 'Enhance staff capacity through training'],
    72.5,
    16.8,
    89.3,
    'VERY_GOOD'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample performance objectives
INSERT INTO performance_objectives (id, bsc_id, perspective, objective, percentage, actions, expected_results, kpis, score, comments) VALUES
('po_001', 'bsc_001', 'STAKEHOLDERS_CLIENTS', 'Improve citizen satisfaction with public services', 15.0, 
 ARRAY['Conduct citizen satisfaction surveys', 'Implement feedback system', 'Establish service standards'], 
 ARRAY['Increased satisfaction ratings', 'Better service quality', 'Reduced complaints'], 
 ARRAY['Satisfaction score > 85%', 'Response time < 24 hours', 'Complaint resolution rate > 90%'], 
 78.0, 'Good progress made in citizen engagement initiatives'),

('po_002', 'bsc_001', 'STAKEHOLDERS_CLIENTS', 'Enhance transparency in service delivery', 10.0,
 ARRAY['Publish service standards', 'Create online portal', 'Regular public meetings'],
 ARRAY['Improved transparency', 'Better information access', 'Increased trust'],
 ARRAY['Portal usage > 1000 visits/month', 'Information requests processed within 5 days'],
 82.0, 'Online portal successfully launched and well-received'),

('po_003', 'bsc_001', 'FINANCIAL_STEWARDSHIP', 'Optimize budget utilization', 15.0,
 ARRAY['Monthly budget reviews', 'Cost-benefit analysis', 'Procurement optimization'],
 ARRAY['Better resource allocation', 'Reduced wastage', 'Improved efficiency'],
 ARRAY['Budget variance < 5%', 'Cost savings > 10%', 'Procurement time reduced by 20%'],
 75.0, 'Budget management improved but still room for optimization'),

('po_004', 'bsc_001', 'INTERNAL_PROCESSES', 'Streamline administrative processes', 20.0,
 ARRAY['Process mapping', 'Automation implementation', 'Staff training'],
 ARRAY['Faster processing', 'Reduced errors', 'Better workflow'],
 ARRAY['Processing time reduced by 30%', 'Error rate < 2%', 'Staff productivity increased by 25%'],
 70.0, 'Process improvements implemented with positive results'),

('po_005', 'bsc_001', 'MDA_LG_CAPACITY', 'Enhance staff competencies', 20.0,
 ARRAY['Training needs assessment', 'Capacity building programs', 'Performance monitoring'],
 ARRAY['Improved skills', 'Better performance', 'Career development'],
 ARRAY['Training completion rate > 95%', 'Performance improvement > 20%', 'Staff retention > 90%'],
 68.0, 'Training programs conducted successfully with good participation')
ON CONFLICT (id) DO NOTHING;

-- Insert sample core values
INSERT INTO core_values (id, bsc_id, values, acronym) VALUES
('cv_001', 'bsc_001', 
 ARRAY['Integrity', 'Transparency', 'Accountability', 'Innovation', 'Excellence'], 
 'ITAIE')
ON CONFLICT (id) DO NOTHING;

-- Insert sample behavioral attributes
INSERT INTO behavioral_attributes (id, bsc_id, attribute, percentage, description, score, comments_justification) VALUES
('ba_001', 'bsc_001', 'Leadership', 5.0, 
 'Demonstrates effective leadership skills in guiding team members and achieving organizational goals', 
 85.0, 'Shows strong leadership qualities and effectively motivates team members'),

('ba_002', 'bsc_001', 'Communication', 4.0,
 'Communicates effectively with colleagues, supervisors, and stakeholders at all levels',
 80.0, 'Good communication skills demonstrated in meetings and reports'),

('ba_003', 'bsc_001', 'Problem Solving', 4.0,
 'Identifies problems quickly and develops innovative solutions to address challenges',
 78.0, 'Consistently provides creative solutions to operational challenges'),

('ba_004', 'bsc_001', 'Teamwork', 3.5,
 'Works collaboratively with team members and contributes to a positive work environment',
 88.0, 'Excellent team player who supports colleagues and promotes collaboration'),

('ba_005', 'bsc_001', 'Professional Development', 3.5,
 'Actively seeks opportunities for learning and professional growth',
 82.0, 'Participates in training programs and applies new knowledge effectively')
ON CONFLICT (id) DO NOTHING;
