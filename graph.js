//Node class
class Node {
    #node = new Object()
    constructor(value) {
        this.#node = value
    }
    get value() {
        return this.#node
    }
    set value(value) {
        this.#node = value
    }
}

//export class Graph
export class Graph {
    #graph = new Object()
    constructor(...names) {
        names.forEach(name => {
            this.#graph[name] = {
                node: new Node(null),
                connection: new Set()
            }
        })
    }

    //getters
    get graph() {
        let result = new Map()
        for (let name in this.#graph)
            result[name] = this.#graph[name]
        return result
    }
    get names() {
        let result = new Set()
        for (let name in this.#graph)
            result.add(name)
        return result
    }
    get nodes() {
        let result = new Map()
        for (let name in this.#graph)
            result[name] = this.#graph[name].node.value
        return result
    }
    get connections() {
        let result = new Map()
        for (let name in this.#graph)
            result[name] = this.#graph[name].connection
        return result
    }
    getNodeOf = (name) => {
        return this.nodes[name]
    }
    getConnectionOf = (name) => {
        return this.connections[name]
    }
    getCompositionOf = (name) => {
        let memory = new Set()
        let req = (name) => {
            for (let conn of this.getConnectionOf(name))
                if (!memory.has(conn)) {
                    memory.add(conn)
                    req(conn)
                }
        }
        req(name)
        return memory
    }

    //setters
    setNodeOf = (name, value) => {
        try {
            this.#graph[name].node.value = value
        } catch(e) {
            console.log(e.message)
        }
    }
    setConnectionOf = (name, ...nodeNames) => {
        nodeNames.forEach(nodeName => {
            if (this.#graph.hasOwnProperty(nodeName))
                this.addConnectionOf(name, nodeName)
            else
                console.log("Invalid value!")
        })
    }
    addConnectionOf = (name, nodeName) => {
        try {
            if (this.#graph.hasOwnProperty(nodeName))
                this.#graph[name].connection.add(nodeName)
        } catch (e) {
            console.log(e.message)
        }
    }
    setObject = (name) => {
        this.#graph[name] = {
            node: new Node(null),
            connection: new Set()
        }
    }

    //removers
    deleteObject = (name) => {
        delete this.#graph[name]
    }
    deleteNodeOf = (name) => {
        for (let n in this.#graph)
            this.deleteConnectionOf(n, name)
        delete this.#graph[name]
    }
    deleteConnectionOf = (name, nodeName) => {
        try {
            if (this.#graph.hasOwnProperty(nodeName))
                this.#graph[name].connection.delete(nodeName)
        } catch (e) {
            console.log(e.message)
        }
    }
    emptyConnectionOf = (name) => {
        if (this.#graph.hasOwnProperty(name))
            this.#graph[name].connection = new Set()
        else {
            console.log("Invalid value!")
        }
    }

    //maker
    eq = () => {
        let help = (name, func) => {
            let pars = func(name)
            for (let par of pars)
                this.addConnectionOf(par, name)
        }
        let result = []
        let memory = new Set()
        for (let name in this.#graph) {
            this.addConnectionOf(name, name)
            help(name, this.getConnectionOf)
            help(name, this.getCompositionOf)
        }
        for (let name in this.#graph) {
            if (!memory.has(name)) {
                result.push(this.getConnectionOf(name))
                this.getConnectionOf(name).forEach(x => {
                    memory.add(x)
                })
            }
        }
        return result
    }
}