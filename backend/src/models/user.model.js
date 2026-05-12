import mongoose, { Schema } from 'mongoose';

//Sub-Schema: Professional Experience 
const experienceSchema = new Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // Null if 'isCurrent' is true
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    companyLogo: { type: String } 
});

//Sub-Schema: Academic History
const educationSchema = new Schema({
    school: { type: String, required: true, default: "RGUKT, Basar" },
    degree: { type: String, required: true }, 
    fieldOfStudy: { type: String, default: "Computer Science and Engineering" },
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String }, 
    description: { type: String }
});

//MAIN USER SCHEMA
const userSchema = new Schema({
    // 1. Identity & Campus Info
    idNumber: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true,
        trim: true,
        match: [/^[A-Z]\d{6}$/, 'Invalid RGUKT ID format (e.g., B211449)'],
        index: true 
    },
    name: { type: String, required: true },
    branch: { 
        type: String, 
        required: true,
        enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'MME'],
        default: 'CSE' 
    },
    batch: { type: String, required: true },  
    role: { 
        type: String, 
        enum: ['student', 'alumni', 'admin'], 
        default: 'student' 
    },

    // 2. Authentication & Verification
    universityEmail: { type: String, unique: true, sparse: true }, 
    personalEmail: { type: String, unique: true, sparse: true }, 
    password: { type: String, required: true }, 
    isVerified: { type: Boolean, default: false },
    
    // 3. Profile Details
    avatar: { type: String }, 
    coverImage: { type: String }, 
    headline: { type: String, default: "CSE Student @ RGUKT Basar" },
    bio: { type: String, maxLength: 500 },
    location: { type: String, default: "Basar, Telangana" },
    
    socialLinks: {
        github: { type: String },
        linkedin: { type: String },
        portfolio: { type: String }
    },

    // 4. Professional & Technical Data
    skills: [{ type: String }], 
    experience: [experienceSchema],
    education: [educationSchema],

    featuredProjects: [
        {
            title: { type: String, required: true },
            description: { type: String },
            githubLink: { type: String },
            liveLink: { type: String },
            image: { type: String },
            techStack: [{ type: String }]
        }
    ],

    // 5. Engagement Stats
    stats: {
        mentoredCount: { type: Number, default: 0 },
        projectsCount: { type: Number, default: 0 },
        connectionsCount: { type: Number, default: 0 }
    }

}, {
    timestamps: true 
});

//Validation Middleware 
userSchema.pre('validate', function(next) {
    this.experience.forEach(exp => {
        if (exp.endDate && exp.startDate > exp.endDate) {
            return next(new Error('Experience start date must be before end date'));
        }
    });
    this.education.forEach(edu => {
        if (edu.endDate && edu.startDate > edu.endDate) {
            return next(new Error('Education start date must be before end date'));
        }
    });
    next();
});

export const User = mongoose.model('User', userSchema);