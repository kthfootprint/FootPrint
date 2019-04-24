route = () => {
    $(document).ready(function(){
        const Url="https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=fridhemsplan&destination=odenplan&mode=transit&alternatives=true&key=ENTERKEY";
        
            $.ajax({
                url: Url,
                type: "GET",
                success: function(result){
                    console.log(result)
                },
                error:function(error){
                    console.log("Error", error)
                }
            })
        })
}

hej = () => {
    console.log("hej");
}