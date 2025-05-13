(function ($, Drupal) {
  $("form[id*=webform-submission-eventos-gatorade-add-form]").validate({
    ignore: [],
    rules: {
      nombre: {
        required: true,
        spanish_words: true,
      },
      correo_electronico: {
        required: true,
        email: true,
        emailname: true,
        email_exists: true,
        emailDomainRestriction: true,
      },
      deporte: {
        required: true,
      },
      en_que_evento_te_interesa_participar: {
        required: true,
      },
      valor_total_de_estas_facturas: {
        required: true,
      },
      ciudad: {
        required: true,
      },
      terminos_y_condiciones: {
        required: true,
      },
      politica_de_privacidad: {
        required: true,
      },
    },

    messages: {
      nombre: {
        required: "Debes ingresar tu nombre",
      },
      correo_electronico: {
        required: "Debes ingresar tu correo electrónico",
        email: "Ingresa un correo electrónico válido",
        email_exists: "La dirección de correo que ingresaste ya fue registrada",
      },
      deporte: {
        required: "Debes elegir tu deporte",
      },
      en_que_evento_te_interesa_participar: {
        required: "Debes elegir el evento al que te interesa participar",
      },
      valor_total_de_estas_facturas: {
        required: "Debes ingresar cuanto es el valor del total de tus facturas",
      },
      ciudad: {
        required: "Debes ingresar tu Ciudad",
      },
      terminos_y_condiciones: {
        required: "Por favor, acepta los términos y condiciones",
      },
      politica_de_privacidad: {
        required: "Por favor, acepta la política de privacidad",
      },
    },
  });
})(jQuery, Drupal);
