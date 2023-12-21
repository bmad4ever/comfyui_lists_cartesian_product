from itertools import product


class AnyType(str):
    """Bypass comfy type check"""

    def __ne__(self, __value: object) -> bool:
        return False


class AnyListCartesianProduct:
    RETURN_TYPES = tuple([AnyType("*") for _ in range(9)])
    FUNCTION = "cart_prod"
    CATEGORY = "utils"
    OUTPUT_IS_LIST = tuple([True for _ in range(9)])
    INPUT_IS_LIST = True

    @classmethod
    def INPUT_TYPES(cls):
        return {"required": {
            "inputs_len": ("INT", {"default": 2, "min": 2, "max": 9}),
        }}

    def cart_prod(self, inputs_len, **kwargs):
        values = list(kwargs.values())[:inputs_len[0]]  # ignore input names
        cp_tuples = list(product(*values))
        return tuple([t[i] for t in cp_tuples] for i in range(inputs_len[0]))


NODE_CLASS_MAPPINGS = {
    "AnyListCartesianProduct": AnyListCartesianProduct
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "AnyListCartesianProduct": "Lists Cartesian Product"
}
