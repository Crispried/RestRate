﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Domain.Entities;
using System.Threading.Tasks;

namespace Domain.Abstract
{
    public interface ICommentRepository
    {
        IQueryable<Comment> Comments { get; }
        void SaveComment(Comment comment);
        Comment DeleteComment(int commentID);
    }
}
