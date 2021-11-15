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
            if (typeof name == 'string'){
                this.#graph[name] = {
                    node: new Node(null),
                    connection: new Set()
                }
            } else {
                console.log("Invalid name!")
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
    getPowerOf = (name) => {
        let inCounter = 0
        let outCounter = this.getConnectionOf(name).size
        for (let n in this.#graph)
            if (this.connections[n].has(name))
                inCounter++
        let obj = {}
        obj.in = inCounter
        obj.out = outCounter
        return obj
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
    createNameOf = (name) => {
        if (typeof name == 'string'){
            this.#graph[name] = {
                node: new Node(null),
                connection: new Set()
            }
        } else {
            console.log("Invalid name!")
        }
    }

    //removers
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
        let result = []
        let memory = new Set()
        for (let name in this.#graph)
            if (!memory.has(name)) {
                let equiv = this.getCompositionOf(name).add(name)
                result.push(equiv)
                let arr = [...equiv]
                arr.forEach(element => {
                    memory.add(element)
                });
            }
        return result
    }
    cut = (name) => {
        try {
            let valid = this.getCompositionOf(name)
            let names = [...this.names]
            let invalid = names.filter(x => !valid.has(x))
            for (let elem of invalid)
                this.deleteNodeOf(elem)
            return this
        } catch (e) {
            console.log("Invalid value!")
            return this
        }
    }
}