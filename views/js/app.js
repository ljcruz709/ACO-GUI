let app = new Vue({
    el: '#params',
    data: {
        initial_pheromone: 0,
        ants_per_iteration: 0,
        max_iterations: 0,
        minimize: true,
        file: false,
        fileName: "graph.json",
        graph: false
    },
    methods: {
        sendParams: function () {
            let request = {
                initial_pheromone: this.initial_pheromone,
                ants_per_iteration: this.ants_per_iteration,
                max_iterations: this.max_iterations,
                minimize: this.minimize
            }
            axios
                .post('http://localhost:8380/', request)
                .then(response => (alert(response.body)))
        },
        uploadJson: function () {
            this.file = true
            let formData = new FormData()
            const jsonFile = document.querySelector('#file')
            formData.append(this.fileName, jsonFile.files[0])
            axios
                .post('http://localhost:8380/json', formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    this.graph = response["status_file"] == true ? true : false
                    alert(graph)
                })

        },
       
    }
})