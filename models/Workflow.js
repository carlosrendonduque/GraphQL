const mongoose = require('mongoose');
const WorkflowsSchema = mongoose.Schema({
    workflow:{
        type: Array,
        required: true
    },
    total_microservices:{
        type: Number,
        required: true
    },
    client: {
        type.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    consultant: {
        type.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    state: {
        type: String,
        default: "PENDING"
    }, 
    createdat:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Workflow', WorkflowsSchema);