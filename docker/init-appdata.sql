CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    explorer_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nodes (
    node_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('place', 'event', 'person', 'group', 'thing', 'other')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    title TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_nodes (
    session_node_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    node_id TEXT NOT NULL REFERENCES nodes(node_id),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (session_id, node_id)
);

CREATE TABLE user_node_interactions (
    user_id UUID NOT NULL REFERENCES users(user_id),
    node_id TEXT NOT NULL REFERENCES nodes(node_id),
    interacted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    replay_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id, node_id)
);

CREATE TABLE node_text (
    node_text_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id TEXT NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    text TEXT,
    follow_on JSONB,
    UNIQUE (node_id, language_code)
);

CREATE TABLE node_images (
    image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id TEXT NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(user_id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE node_audio (
    audio_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id TEXT NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    audio_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (node_id, language_code)
);

CREATE TABLE node_relationships (
    relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_a TEXT NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    node_b TEXT NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (node_a, node_b, relationship_type)
);

CREATE TABLE node_comments (
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id TEXT NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    parent_comment_id UUID REFERENCES node_comments(comment_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE node_interest_ratings (
    rating_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    node_id TEXT NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, node_id)
);

CREATE TABLE votes (
    vote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    target_id TEXT NOT NULL,
    target_type TEXT CHECK (target_type IN ('comment', 'image')) NOT NULL,
    vote INT CHECK (vote IN (-1, 1)) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, target_id, target_type)
);

CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    target_id TEXT NOT NULL,
    target_type TEXT CHECK (target_type IN ('comment', 'image', 'node')) NOT NULL,
    reason TEXT CHECK (reason IN ('inappropriate', 'inaccurate', 'outdated', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_user ON sessions (user_id);
CREATE INDEX idx_sessionnodes_session_node ON session_nodes (session_id, node_id);
CREATE INDEX idx_nodetext_node_language ON node_text (node_id, language_code);
CREATE INDEX idx_nodeaudio_node_language ON node_audio (node_id, language_code);
CREATE INDEX idx_noderelationships_nodea ON node_relationships (node_a);
CREATE INDEX idx_noderelationships_nodeb ON node_relationships (node_b);
CREATE INDEX idx_nodecomments_node ON node_comments (node_id);
CREATE INDEX idx_votes_target ON votes (target_id, target_type);
CREATE INDEX idx_reports_target ON reports (target_id, target_type);