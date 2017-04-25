export default function(initOptions={}) {
    var datumGraticule = d3.geoGraticule();
    var _ = {svg:null, select: null};

    function svgAddGraticule() {
        _.svg.selectAll('.graticule').remove();
        if (!this._.options.hideGraticule) {
            this._.graticule = _.svg.append("g").attr("class","graticule").append("path")
                .datum(datumGraticule)
                .style("fill", "none")
                .style("opacity", "0.2")
                .style("stroke", "black")
                .style("stroke-width", "0.5")
                .attr("class", "noclicks")
                .attr("d", this._.path);
            return this._.graticule;
        }
    }

    initOptions = Object.assign({
        hideGraticule: false,
    }, initOptions);

    return {
        name: 'graticulePlugin',
        onInit() {
            Object.assign(this._.options, initOptions);
            this.svgAddGraticule = svgAddGraticule;
            _.svg = this._.svg;
        },
        onRefresh() {
            if (this._.graticule && !this._.options.hideGraticule) {
                this._.graticule.attr("d", this._.path);
            }
        },
        select(slc) {
            _.select = slc;
            _.svg = d3.selectAll(slc);
            return _.svg;
        }
    }
}
