import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Post } from "@/types/app";


/**
 * 
 * @param postId ID of the post to display
 * @returns The post if it is not a repost
 *         or the original post if it is a repost
 */

export const useDisplayPost = (post: Post): Post => {
    const isARepost = !!post.originalID;
    const originalPost = useQuery(api.posts.getPost, { postId: post.originalID });

    return isARepost && originalPost ? originalPost : post;
}