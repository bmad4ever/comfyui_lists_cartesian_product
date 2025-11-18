import { app as t } from "/scripts/app.js";

t.registerExtension({
    name: "Comfy.Bmad.AnyCartesianProduct",
    async beforeRegisterNodeDef(t, e, i) {
        if ("AnyListCartesianProduct" !== e.name) return;

        // Custom onNodeCreated to remove default '*' outputs and set types
        let s = t.prototype.onNodeCreated;
        t.prototype.onNodeCreated = function () {
            let t = s ? s.apply(this, arguments) : void 0;
            for (let e = this.outputs.length - 1; e >= 0; e--) {
                "*" === this.outputs[e].name && this.removeOutput(e);
            }
            this.input_type = "*";
            this.output_type = "*";
            return t;
        };

        // Custom getExtraMenuOptions to handle dynamic I/O update
        let p = t.prototype.getExtraMenuOptions;
        t.prototype.getExtraMenuOptions = function (t, e) {
            let i = p ? p.apply(this, arguments) : void 0;

            e.unshift({
                content: "update I/Os",
                callback: () => {
                    let t = this.widgets.find(t => "inputs_len" === t.name).value;
                    let e = void 0 === this.inputs ? 0 : this.inputs.length;
                    let i = void 0 === this.inputs ? 0 : this.outputs.length;
                    
                    // --- THE FIX IS HERE ---
                    // The original code tried to re-order the first input, but it was flawed.
                    // We only want dynamic inputs (i1, i2, etc.) to be affected.
                    // The actual inputs list starts AFTER the first input, which is the "inputs_len" widget.
                    
                    const dynamic_inputs_start_index = 1; // Input 'inputs_len' is at index 0.

                    // 1. Remove excess inputs (starting from the dynamic inputs)
                    let current_dynamic_inputs_count = e - dynamic_inputs_start_index;
                    let inputs_to_remove = current_dynamic_inputs_count - t;
                    
                    if (inputs_to_remove > 0) {
                        for (let o = 0; o < inputs_to_remove; o++) {
                            // We remove the last dynamic input, which is at the current end of the list
                            this.removeInput(this.inputs.length - 1); 
                        }
                    }

                    // 2. Add required inputs
                    current_dynamic_inputs_count = this.inputs.length - dynamic_inputs_start_index;

                    if (current_dynamic_inputs_count < t) {
                        for (let u = current_dynamic_inputs_count; u < t; u++) {
                            // Add new inputs with the correct index (i1, i2, etc.)
                            // The new input is added to the end, after the 'inputs_len' widget
                            this.addInput(`i${u + 1}`, this.input_type);
                        }
                    }
                    
                    // The input logic is now fixed. Outputs logic was mostly correct, but adjusting for clarity.

                    // 3. Update Outputs
                    // Remove excess outputs
                    for (let r = i; r > t; --r) {
                        this.removeOutput(r - 1);
                    }

                    // Add required outputs
                    for (let h = i; h < t; h++) {
                        this.addOutput(`o${h + 1}`, this.output_type);
                    }

                    // Force the node to update its size and connections
                    this.setDirtyCanvas(true, true);
                }
            }), i
        }
    }
});
