import mongoose from "mongoose";
// Declare the Schema of the Mongo model

var productSchema = new mongoose.Schema(
    
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required:false,
          },
        
        title:{
        type:String,
        required:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
        // unique:true,
    },
    price:{
        type:String,
        required:true,
        unique:true,
    },
    quantity:{
        type:String,
        required:true,
        // unique:true,
    },
    color:{
        type:String,
        required:true,
    }, 
    images: {
        type: [String], // Array of image URLs or paths
        required: false
    },

},

{
    timestamps:true,
}


);
export default mongoose.model("Product", productSchema);

// this code to encrypt password 

/*userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//match password
userSchema.methods.isPasswordMatched =  async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


// used crypto for token
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30*60*1000;
    return resetToken;
}

export default mongoose.model('User', userSchema);
*/