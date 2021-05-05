const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');

const customerDataAPi = "http://localhost:3000/customers";

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
                // for (let i = 0; i < customers.length; i++) {
                //     if (customers[i].id == args.id) {
                //         return customers[i];
                //     }

                // }

                return axios.get(`${customerDataAPi}/${args.id}`)
                    .then(res => res.data)
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return axios.get(customerDataAPi)
                    .then(res => res.data)
            }
        }
    }

});

// Mutation
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: {
                    // GraphQLNonNull means a field is required.
                    // So name will be required
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    // GraphQLNonNull means a field is required.
                    // So email will be required
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    // GraphQLNonNull means a field is required.
                    // So age will be required
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(parentValue, args) {
                return axios.post(customerDataAPi, {
                    name: args.name,
                    age: args.age,
                    email: args.email
                })
                    .then(res => res.data);
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }

            },
            resolve(parentValue, args) {
                return axios.delete(`${customerDataAPi}/${args.id}`)
                    .then(res => res.data);
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                name: {

                    type: GraphQLString
                },
                email: {

                    type: GraphQLString
                },
                age: {

                    type: GraphQLInt
                }

            },
            resolve(parentValue, args) {
                return axios.patch(`${customerDataAPi}/${args.id}`, args)
                    .then(res => res.data);
            }
        },

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})