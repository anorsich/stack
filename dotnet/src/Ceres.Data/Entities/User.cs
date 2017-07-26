﻿using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Bson.Serialization.Attributes;

namespace Ceres.Data.Entities
{
    public class User : IEntity
    {
        [BsonId]
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }

        public User()
        {
            Id = Guid.NewGuid();
        }
    }
}