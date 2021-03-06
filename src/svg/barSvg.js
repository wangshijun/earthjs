export default urlBars => {
    /*eslint no-console: 0 */
    const _ = {svg:null, barProjection: null, q: null, bars: null, valuePath: null};
    const $ = {};
    const scale50 = d3.scaleLinear().domain([0, 200]).range([5, 50]);

    function init() {
        const __ = this._;
        __.options.showBars = true;
        _.barProjection = __.projection();
        _.svg = __.svg;
    }

    function create() {
        const __ = this._;
        const klas = _.me.name;
        svgClipPath.call(this);
        _.svg.selectAll(`.bar.${klas}`).remove();
        if (_.bars && __.options.showBars) {
            const gBar = _.svg.append('g').attr('class', `bar ${klas}`);
            const mask = gBar.append('mask')
                .attr('id', 'edge');
            mask.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('fill', 'white');
            mask.append('use')
                .attr('xlink:href', '#edgeCircle')
                .attr('fill', 'black');

            _.max = d3.max(_.bars.features, d => parseInt(d.geometry.value))

            const r = __.proj.scale();
            _.heightScale = d3.scaleLinear().domain([0, _.max]).range([r, r+scale50(r)]);

            $.bar = gBar.selectAll('line').data(_.bars.features).enter().append('line')
                .attr('stroke', 'red')
                .attr('stroke-width', '2')
                .attr('data-index', (d, i) => i);
            refresh.call(this);
        }
    }

    function refresh() {
        const __ = this._;
        if (_.bars && __.options.showBars) {
            const proj1 = __.proj;
            const scale = _.heightScale;
            const proj2 = _.barProjection;
            const center = proj1.invert(__.center);
            proj2.rotate(this._.proj.rotate());
            $.bar
                .each(function(d) {
                    const arr = d.geometry.coordinates;
                    proj2.scale(scale(d.geometry.value));
                    const distance = d3.geoDistance(arr, center);
                    const d1 = proj1(arr);
                    const d2 = proj2(arr);
                    d3.select(this)
                        .attr('x1', d1[0])
                        .attr('y1', d1[1])
                        .attr('x2', d2[0])
                        .attr('y2', d2[1])
                        .attr('mask', distance < 1.57 ? null : 'url(#edge)');
                });
        }
    }

    function svgClipPath() {
        const __ = this._;
        this.$slc.defs.selectAll('clipPath').remove();
        this.$slc.defs.append('clipPath').append('circle')
            .attr('id', 'edgeCircle')
            .attr('cx', __.center[0])
            .attr('cy', __.center[1])
            .attr('r',  __.proj.scale());
    }

    return {
        name: 'barSvg',
        urls: urlBars && [urlBars],
        onReady(err, bars) {
            _.me.data(bars);
        },
        onInit(me) {
            _.me = me;
            init.call(this);
        },
        onCreate() {
            create.call(this);
        },
        onRefresh() {
            refresh.call(this);
        },
        onResize() {
            create.call(this);
        },
        selectAll(q) {
            if (q) {
                _.q = q;
                _.svg = d3.selectAll(q);
            }
            return _.svg;
        },
        valuePath(path) {
            _.valuePath = path;
        },
        data(data) {
            if (data) {
                if (_.valuePath) {
                    const p = _.valuePath.split('.');
                    data.features.forEach(d => {
                        let v = d;
                        p.forEach(o => v = v[o]);
                        d.geometry.value = v;
                    });
                }
                _.bars = data;
                setTimeout(() => refresh.call(this),1);
            } else {
                return _.bars;
            }
        },
        $bar() {return $.bar;},
    }
}
