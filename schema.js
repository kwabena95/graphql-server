const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');

// Hardcoded data
const customers = [
    {
        id: "1",
        name: "John Doe",
        email: "jdoe@mail.com",
        age: 35
    },
    {
        id: "2",
        name: "Jane Doe",
        email: "janeD@mail.com",
        age: 25
    },
    {
        id: "3",
        name: "Steve Smith",
        email: "boywonder@mail.com",
        age: 16
    },
]

// Customer type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                for (let i = 0; i < customers.length; i++) {
                    if (customers[i].id == args.id) {
                        return customers[i];
                    }

                }
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return customers;
            }
        }
    }

})

module.exports = new GraphQLSchema({
    query: RootQuery
})