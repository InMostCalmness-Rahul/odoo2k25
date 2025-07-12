# Database Schema Documentation

## Overview
The SkillSwap Platform uses MongoDB with Mongoose ODM to manage user data and skill exchange requests. This document provides detailed schema information and relationships.

## Schema Diagrams

### User Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                              User                               │
├─────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (Primary Key)                                    │
│ name: String (required, max: 100)                              │
│ email: String (required, unique, lowercase)                    │
│ password: String (required, min: 6, bcrypt hashed)             │
│ location: String (optional, max: 200)                          │
│ skillsOffered: [String] (max: 20 items, each max: 100 chars)   │
│ skillsWanted: [String] (max: 20 items, each max: 100 chars)    │
│ availability: [String] (enum: weekends, weekdays, evenings)    │
│ profilePhoto: String (URL, optional)                           │
│ isPublic: Boolean (default: true)                              │
│ isActive: Boolean (default: true)                              │
│ role: String (enum: user, admin; default: user)                │
│ rating: Number (default: 0, min: 0, max: 5)                    │
│ feedbackCount: Number (default: 0)                             │
│ feedbacks: [FeedbackSchema]                                    │
│ refreshToken: String (optional, for JWT refresh)               │
│ createdAt: Date (auto-generated)                               │
│ updatedAt: Date (auto-generated)                               │
└─────────────────────────────────────────────────────────────────┘
```

### Feedback Sub-Schema (Embedded in User)

```
┌─────────────────────────────────────────────────────────────────┐
│                            Feedback                             │
├─────────────────────────────────────────────────────────────────┤
│ from: ObjectId (ref: User, required)                           │
│ rating: Number (required, min: 1, max: 5)                      │
│ comment: String (optional, max: 500)                           │
│ createdAt: Date (default: Date.now)                            │
└─────────────────────────────────────────────────────────────────┘
```

### SwapRequest Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                         SwapRequest                             │
├─────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (Primary Key)                                    │
│ fromUser: ObjectId (ref: User, required)                       │
│ toUser: ObjectId (ref: User, required)                         │
│ offeredSkill: String (required, max: 100)                      │
│ requestedSkill: String (required, max: 100)                    │
│ message: String (optional, max: 1000)                          │
│ status: String (enum: pending, accepted, rejected, completed,   │
│                       cancelled; default: pending)             │
│ scheduledDate: Date (optional)                                  │
│ duration: String (optional, max: 100)                          │
│ meetingType: String (enum: online, in-person, either)          │
│ meetingDetails: String (optional, max: 500)                    │
│ rejectionReason: String (optional, max: 500)                   │
│ cancellationReason: String (optional, max: 500)                │
│ completedAt: Date (optional)                                   │
│ createdAt: Date (auto-generated)                               │
│ updatedAt: Date (auto-generated)                               │
└─────────────────────────────────────────────────────────────────┘
```

## Relationships

### User → SwapRequest (One-to-Many)
- A User can send multiple SwapRequests (fromUser relationship)
- A User can receive multiple SwapRequests (toUser relationship)
- When populating SwapRequests, both fromUser and toUser reference User documents

### User → Feedback (One-to-Many Embedded)
- Each User document contains an array of feedback objects
- Each feedback object references the User who provided the feedback via the `from` field
- This creates a many-to-many relationship where users can give feedback to multiple users

## Indexes

### User Collection
- `email`: Unique index (automatically created by unique: true)
- `skillsOffered`: Text index for search functionality
- `skillsWanted`: Text index for search functionality
- `location`: Index for location-based filtering
- `isPublic`: Index for filtering public profiles
- `role`: Index for admin queries

### SwapRequest Collection
- `fromUser`: Index for user's sent requests
- `toUser`: Index for user's received requests
- `status`: Index for status filtering
- `createdAt`: Index for chronological sorting
- Compound index: `{fromUser: 1, toUser: 1}` for relationship queries

## Data Validation

### User Validation
- **Name**: Required, 2-100 characters, letters and spaces only
- **Email**: Required, valid email format, unique
- **Password**: Required, minimum 6 characters, must contain uppercase, lowercase, and number
- **Skills**: Maximum 20 skills per array, each skill maximum 100 characters
- **Location**: Maximum 200 characters
- **Availability**: Must be one of: weekends, weekdays, evenings
- **Rating**: 0-5 numeric range

### SwapRequest Validation
- **Users**: fromUser and toUser must be valid ObjectIds and different users
- **Skills**: Required, maximum 100 characters each
- **Message**: Maximum 1000 characters
- **Status**: Must be one of defined enum values
- **Meeting Type**: Must be one of: online, in-person, either
- **Dates**: scheduledDate must be in the future when provided

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with salt rounds
- Password field is excluded from queries by default (`select: false`)
- Minimum complexity requirements enforced

### Data Sanitization
- All string inputs are trimmed
- Email addresses are converted to lowercase
- XSS protection through input validation

### Access Control
- User role-based access (user, admin)
- Users can only modify their own data
- Admins have elevated permissions for platform management

## Performance Optimizations

### Query Optimization
- Strategic indexing on frequently queried fields
- Pagination implemented for large result sets
- Selective field population to reduce data transfer

### Data Structure
- Embedded feedback documents reduce join operations
- Appropriate use of references vs. embedding based on access patterns

## Migration Notes

### Future Schema Changes
- All schema modifications should be backward compatible
- Migration scripts required for breaking changes
- Version field can be added for tracking schema versions

### Scaling Considerations
- Feedback array size should be monitored for large users
- Consider moving to separate collection if feedback volume grows significantly
- SwapRequest status changes could benefit from audit trail in future versions
