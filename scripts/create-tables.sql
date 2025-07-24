-- Create tables for BSC system
-- This script creates all necessary tables for the Balance Score Card application

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    employee_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    salary_scale TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create BSCs table
CREATE TABLE IF NOT EXISTS bscs (
    id TEXT PRIMARY KEY,
    year INTEGER NOT NULL,
    supervisee_id TEXT NOT NULL,
    supervisor_id TEXT NOT NULL,
    mandate TEXT NOT NULL,
    vision TEXT NOT NULL,
    mission TEXT NOT NULL,
    goal TEXT NOT NULL,
    ndp_programmes TEXT[] NOT NULL,
    departmental_mandate TEXT NOT NULL,
    strategic_objectives TEXT[] NOT NULL,
    performance_score DECIMAL(5,2) DEFAULT 0,
    behavioral_score DECIMAL(5,2) DEFAULT 0,
    overall_score DECIMAL(5,2) DEFAULT 0,
    performance_level TEXT DEFAULT 'UNSATISFACTORY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supervisee_id) REFERENCES employees(id),
    FOREIGN KEY (supervisor_id) REFERENCES employees(id)
);

-- Create performance_objectives table
CREATE TABLE IF NOT EXISTS performance_objectives (
    id TEXT PRIMARY KEY,
    bsc_id TEXT NOT NULL,
    perspective TEXT NOT NULL CHECK (perspective IN ('STAKEHOLDERS_CLIENTS', 'FINANCIAL_STEWARDSHIP', 'INTERNAL_PROCESSES', 'MDA_LG_CAPACITY')),
    objective TEXT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    actions TEXT[] NOT NULL,
    expected_results TEXT[] NOT NULL,
    kpis TEXT[] NOT NULL,
    score DECIMAL(5,2) DEFAULT 0,
    comments TEXT,
    FOREIGN KEY (bsc_id) REFERENCES bscs(id) ON DELETE CASCADE
);

-- Create core_values table
CREATE TABLE IF NOT EXISTS core_values (
    id TEXT PRIMARY KEY,
    bsc_id TEXT NOT NULL,
    values TEXT[] NOT NULL,
    acronym TEXT NOT NULL,
    FOREIGN KEY (bsc_id) REFERENCES bscs(id) ON DELETE CASCADE
);

-- Create behavioral_attributes table
CREATE TABLE IF NOT EXISTS behavioral_attributes (
    id TEXT PRIMARY KEY,
    bsc_id TEXT NOT NULL,
    attribute TEXT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    description TEXT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0,
    comments_justification TEXT,
    FOREIGN KEY (bsc_id) REFERENCES bscs(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON employees(employee_number);
CREATE INDEX IF NOT EXISTS idx_bscs_supervisee_id ON bscs(supervisee_id);
CREATE INDEX IF NOT EXISTS idx_bscs_supervisor_id ON bscs(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_bscs_year ON bscs(year);
CREATE INDEX IF NOT EXISTS idx_performance_objectives_bsc_id ON performance_objectives(bsc_id);
CREATE INDEX IF NOT EXISTS idx_performance_objectives_perspective ON performance_objectives(perspective);
CREATE INDEX IF NOT EXISTS idx_core_values_bsc_id ON core_values(bsc_id);
CREATE INDEX IF NOT EXISTS idx_behavioral_attributes_bsc_id ON behavioral_attributes(bsc_id);
