package com.uday.rguktconnect.repository.posts;

import com.uday.rguktconnect.entity.Comment;
import com.uday.rguktconnect.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostAndParentCommentIsNullOrderByCreatedAtAsc(Post post);

    List<Comment> findByPost(Post post);

    long countByPost(Post post);
}
