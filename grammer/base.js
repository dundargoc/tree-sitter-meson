module.exports = {
  //_command_invocation: ($) =>
  //  choice(
  //    $.normal_command,
  //    $.if_condition,
  //    $.foreach_loop,
  //    $.while_loop,
  //    $.function_def,
  //    $.macro_def,
  //  ),
  // project(a)
  // find_program('git', native: true)
  // runcommand([a,b,c])
  normal_command: ($) =>
    command(
      $.identifier,
      seq(
        repeat(
          seq(
            choice(
              $.string,
              $.identifier,
              $.pair,
            ),
            ",",
          ),
        ),
        choice(
          $.string,
          $.identifier,
          $.pair,
        ),
        optional(","),
      ),
    ),
  bool: ($) =>
    choice(
      "true",
      "false",
    ),
  string: ($) =>
    choice(
      //'sss.ss'
      seq(
        "'",
        /[^']+/g,
        "'",
      ),
      //"ss.ss"
      seq(
        '"',
        /[^"]+/g,
        '"',
      ),
      seq(
        "'''",
        /[^''']+/g,
        "'''",
      ),
    ),
  dictionaries: ($) =>
    seq(
      "{",
      repeat(
        seq(
          $.pair,
          ",",
        ),
      ),
      "}",
    ),
  list: ($) =>
    seq(
      "[",
      repeat(
        choice(
          $.string,
          field("variable", $.identifier),
        ),
      ),
      optional(","),
      "]",
    ),
  pair: ($) =>
    seq(
      field(
        "key",
        choice(
          $.identifier,
          $.string,
        ),
      ),
      ":",
      field(
        "value",
        choice(
          $.number,
          $.identifier,
          $.list,
          $.string,
          $.bool,
        ),
      ),
    ),
  identifier: (_) => /[A-Za-z_][A-Za-z0-9_]*/,
  comment: (_) =>
    seq(
      "#",
      /[^\n]+/g,
    ),
  number: ($) => {
    const hex_literal = seq(
      choice("0x", "0X"),
      /[\da-fA-F](_?[\da-fA-F])*/,
    );

    const decimal_digits = /\d(_?\d)*/;
    const signed_integer = seq(optional(choice("-", "+")), decimal_digits);
    const exponent_part = seq(choice("e", "E"), signed_integer);

    const binary_literal = seq(choice("0b", "0B"), /[0-1](_?[0-1])*/);

    const octal_literal = seq(choice("0o", "0O"), /[0-7](_?[0-7])*/);

    const bigint_literal = seq(
      choice(hex_literal, binary_literal, octal_literal, decimal_digits),
      "n",
    );

    const decimal_integer_literal = choice(
      "0",
      seq(optional("0"), /[1-9]/, optional(seq(optional("_"), decimal_digits))),
    );

    const decimal_literal = choice(
      seq(
        decimal_integer_literal,
        ".",
        optional(decimal_digits),
        optional(exponent_part),
      ),
      seq(".", decimal_digits, optional(exponent_part)),
      seq(decimal_integer_literal, exponent_part),
      seq(decimal_digits),
    );

    return token(choice(
      hex_literal,
      decimal_literal,
      binary_literal,
      octal_literal,
      bigint_literal,
    ));
  },
};
function command(name_rule, arg_rule) {
  return seq(
    name_rule,
    repeat(/[\t ]/),
    "(",
    optional(
      arg_rule,
    ),
    ")",
  );
}