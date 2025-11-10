export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Post {
    _id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    imageUrl?: string;
    timestamp: number;
    likes: string[];
    comments: number;
}


export interface RegisterArgs {
    email: string;
    name: string;
    password: string;
}

export interface LoginArgs {
    email: string;
    password: string;
}

// Define return types
export interface RegisterResult {
    userId: string;
    name: string;
    email: string;
}

export interface LoginResult {
    userId: string;
    name: string;
    email: string;
    avatar?: string;
}
