import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please enter your name"],
            trim:true,
        },

        email:{
            type:String,
            required:[true,"Please enter your email"],
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            required:[true,"Please enter your password"],
            minLength:[8,"Password must be at least 8 characters"],
            // select:false,
        },

        cartItems:[
            {
                quantity:{
                    type:Number,
                    default:1
                },
                products:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                }
            }
        ],

        role:{
            type:String,
            enum:["customer","admin"],
            default:"customer"
        },
    },
    {
        timestamps: true
    }
)


//This is kind of middleware or pre-save hook that hashes the password before saving it to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;