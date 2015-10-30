var margin = {t:50,r:125,b:50,l:125};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Scale for the size of the circles
var scaleR = d3.scale.sqrt().domain([5,100]).range([5,110]);


d3.csv('data/olympic_medal_count.csv', parse, dataLoaded);

function dataLoaded(err,rows){

    var year = 1900;
    rows.sort(function(a,b){
        //Note: this is called a "comparator" function
        //which makes sure that the array is sorted from highest to lowest
        return b[year] - a[year];
    });

    //Note: this returns "top5" as a subset of the larger array "rows", containing positions 0,1,2,3,4
    var top5 = rows.slice(0,5);

    //Call the draw function
    draw(top5, year);

    //TODO: fill out this function
    //There comes the problem l36-l43
    d3.selectAll('.btn').on('click',function(){

        var year = d3.select(this).attr('data-year');
        console.log(year);

        console.log("Show top 5 medal count for: " + year);
        //filling out this function

        if (year == '1900'){
            var year=1900;
            console.log('i am right here to draw 1900')
            console.log(year)
            rows.sort(function(a,b){
                return b[year] - a[year];
            })
            var top5 = rows.slice(0,5);
            console.log(top5)
            draw(top5,1900)
        }
        else if (year == '1960'){
            var year=1960;
            console.log('i am right here to draw 1960')
            console.log(year)
            rows.sort(function(a,b){
                return b[year] - a[year];
            })
            var top5 = rows.slice(0,5);
            console.log(top5)
            draw(top5,1960)
        }
        else if (year == '2012'){
            var year=2012;
            rows.sort(function(a,b){
                return b[year] - a[year];
            })
            var top5 = rows.slice(0,5);
            draw(top5,2012)
        }

    });
}

function draw(rows, year){
    //TODO: Complete drawing function, accounting for enter, exit, update
    //Note that this function requires two parameters
    //The second parameter, "year", determines which one of the three years (1900,1960,2012) to draw the medal counts based on
    console.log('i am inside the draw function')

    var topTeams = canvas.selectAll('.team')//unknown length
        .data(rows,function(d){ return d.country; })//unknown amount//did

    //enter
    var teamsEnter = topTeams.enter()//unknown
        .append('g')
        .attr('class','team')
        .attr('transform',function(d,i){

            return 'translate('+ i*(width/5) + ',' + 0 + ')';//translate how much?
        })
        .style('opacity',0);

    teamsEnter
        .append('circle')
        .attr('r',function(d){
            return scaleR(d[year]);
        });

    teamsEnter
        .append('text')
        .attr('class','team-name')
        .text(function(d){ return d.country;})
        .attr('y', function(d){ return scaleR(d[year])})
        .attr('text-anchor','middle');

    teamsEnter
        .append('text')
        .attr('class','medal-count')
        .text(function(d){ return d[year];})
        .attr('text-anchor','middle');
//exit
    var teamsExit = topTeams.exit()
        .transition()
        .duration(200)
        .attr('transform',function(d,i){
            return 'translate(' + i*(width/4) + ',' + height + ')';
        })
        .style('opacity',0)
        .remove();

    var teamsTransition = topTeams.transition().duration(1000);

    teamsTransition
        .attr('transform',function(d,i){
            return 'translate(' + i*(width/4) + ',' + height/2 + ')';
        })
        .style('opacity',1);
    teamsTransition
        .select('circle')
        .attr('r', function(d){
            return scaleR(d[year]*2);
        });
    teamsTransition
        .select('.team-name')
        .attr('y', function(d){ return scaleR(d[year]+20)});
    teamsTransition
        .select('.medal-count')
        .text(function(d){ return d[year];});
}

function parse(row){
    //@param row is each unparsed row from the dataset
    return {
        country: row['Country'],
        1900: +row['1900'],
        1960: +row['1960'],
        2012: +row['2012']
    };
}