import mongoose, { Schema } from 'mongoose';

const experienceSchema = new Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },  
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    companyLogo: { type: String } 
});

const educationSchema = new Schema({
    school: { type: String, required: true, default: "RGUKT, Basar" },
    degree: { type: String, required: true }, 
    fieldOfStudy: { type: String, default: "Computer Science and Engineering" },
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String }, 
    description: { type: String }
});

const userSchema = new Schema({
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

    universityEmail: { type: String, unique: true, sparse: true }, 
    personalEmail: { type: String, unique: true, sparse: true }, 
    password: { type: String, required: true }, 
    isVerified: { type: Boolean, default: false },
    
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

    stats: {
        mentoredCount: { type: Number, default: 0 },
        projectsCount: { type: Number, default: 0 },
        connectionsCount: { type: Number, default: 0 }
    }

}, {
    timestamps: true 
});

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