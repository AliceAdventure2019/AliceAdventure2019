
var container;
var editor;
var components;
var engine;

var numSocket = new Rete.Socket('Number value');
var VueNumControl = {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
    template:
        '<input type="number" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop=""/>',
    data() {
        return {
            value: 0
        };
    },
    methods: {
        change(e) {
            this.value = +e.target.value;
            this.update();
        },
        update() {
            if (this.ikey) this.putData(this.ikey, this.value);
            this.emitter.trigger('process');
        }
    },
    mounted() {
        this.value = this.getData(this.ikey);
    }
};

function initializeEditor() {
    container = document.querySelector('#rete');
    components = [new NumComponent(), new AddComponent()];

    editor = new Rete.NodeEditor('alice-adventure-puzzle-editor@0.1.0', container);
    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);

    engine = new Rete.Engine('alice-adventure-puzzle-editor@0.1.0');
    components.map(c => {
        editor.register(c);
        engine.register(c);
    });
    editor.on(
        'process nodecreated noderemoved connectioncreated connectionremoved',
        async () => {
            console.log('process');
            await engine.abort();
            await engine.process(editor.toJSON());
        }
    );
}

async function newNumNode() {
    components = [new NumComponent(), new AddComponent()];

    var newNode = await components[0].createNode({ num: 21 });

    editor.addNode(newNode);


    console.log(editor)
    // engine.abort();
    editor.trigger('process');
}

async function newAddNode() {
    components = [new NumComponent(), new AddComponent()];
    var newAddNode = await components[1].createNode();
    editor.addNode(newAddNode);


    editor.trigger('process');
}

class NumControl extends Rete.Control {
    constructor(emitter, key, readonly) {
        super(key);
        this.component = VueNumControl;
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}

class NumComponent extends Rete.Component {
    constructor() {
        super('Number');
    }

    builder(node) {
        var out1 = new Rete.Output('num', 'Number', numSocket);

        return node
            .addControl(new NumControl(this.editor, 'num'))
            .addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs['num'] = node.data.num;
    }
}

class AddComponent extends Rete.Component {
    constructor() {
        super('Add');
    }

    builder(node) {
        var inp1 = new Rete.Input('num1', 'Number', numSocket);
        var inp2 = new Rete.Input('num2', 'Number2', numSocket);
        var out = new Rete.Output('num', 'Number', numSocket);

        inp1.addControl(new NumControl(this.editor, 'num1'));
        inp2.addControl(new NumControl(this.editor, 'num2'));

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl(this.editor, 'preview', true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var n1 = inputs['num1'].length ? inputs['num1'][0] : node.data.num1;
        var n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
        var sum = n1 + n2;

        this.editor.nodes
            .find(n => n.id == node.id)
            .controls.get('preview')
            .setValue(sum);
        outputs['num'] = sum;
    }
}




(async () => {
    if (newAddNode != null) {
        console.log(newAddNode.input)
    }
    // var container = document.querySelector('#rete');
    // var components = [new NumComponent(), new AddComponent()];

    // var editor = new Rete.NodeEditor('alice-adventure-puzzle-editor@0.1.0', container);
    // editor.use(ConnectionPlugin);
    // editor.use(VueRenderPlugin);

    // var engine = new Rete.Engine('alice-adventure-puzzle-editor@0.1.0');

    // components.map(c => {
    //     editor.register(c);
    //     engine.register(c);
    // });

    // var n1 = await components[0].createNode({ num: 2 });
    // var n2 = await components[0].createNode({ num: 0 });
    // var add = await components[1].createNode();

    // n1.position = [80, 200];
    // n2.position = [80, 400];
    // add.position = [500, 240];

    // editor.addNode(n1);
    // editor.addNode(n2);
    // editor.addNode(add);

    // editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
    // editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

    // editor.on(
    //     'process nodecreated noderemoved connectioncreated connectionremoved',
    //     async () => {
    //         console.log('process');
    //         await engine.abort();
    //         await engine.process(editor.toJSON());
    //     }
    // );

    // editor.view.resize();
    // editor.trigger('process');
})();



