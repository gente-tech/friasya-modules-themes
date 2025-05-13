(function ($) {

  $.validator.addMethod("email_exists", function(value, element) {
      return !$('#edit-email').hasClass('email-exists');
  }, "El email ya se encuentra registrado.");

  $.validator.addMethod("spanish_words", function (value, element) {
    var re = new RegExp("^[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ ]*$");
    return re.test(value);
  }, "Contiene caracteres inválidos");

  $.validator.addMethod("validPassword", function(value) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
 }, "La contraseña debe tener al menos 10 caracteres y contener al menos una letra y un número.");

  $.validator.addMethod("emailname", function(value, element) {
    var re = new RegExp("[+]+[0-9]+$");
    var email = value.split("@");

    var ed = new RegExp("^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$");
    if (email.length < 2) {
      return true;
    }
    
    return !re.test(email[0]) && ed.test(email[1]);
  }, "Por favor, escribe una dirección de correo válida.");

  $.validator.addMethod("emailDomainRestriction", function(value, element) {
    var domain_restricted = [ 
      'temp-mail.org','correotemporal.org','mohmal.com','yopmail.com',
      'tempail.com','emailondeck.com','emailtemporalgratis.com','crazymailing.com',
      'tempr.email','bupmail.com','guerrillamail.com','temp-mail.io',
      'es.emailfake.com','nowmymail.com','10minutemail.net','es.getairmail.com',
      'mailf5.com','flashmail.it','10minemail.com','mailcatch.com','temp-mails.com',
      'spambox.us','mailnull.com','incognitomail.com','ssl.trashmail.net','trashmail.net',
      'mailinator.com','tempinbox.com','filzmail.com','dropmail.me','spam4.me','cs.email',
      'one-off.email','throwawaymail.com','emailtemporal.org','maildrop.cc',
      'mailforspam.com','trashmail.com','teleworm.us','superrito.com','rhyta.com',
      'jourrapide.com','gustr.com','fleckens.hu','einrot.com','cuvox.de','dayrep.com',
      'muyoc.com','buxod.com','pidox.org','mecip.net','pudxe.com','xedmi.com','ludxc.com',
      'juzab.com','klepf.com','matra.site','bombamail.icu','yermail.net',
      'totallynotfake.net','techblast.ch','spamthis.network','spammy.host','spammer.fail',
      'shadap.org','pewpewpewpew.pw','netcom.ws','itcompu.com','disposable.site',
      'deinbox.com','sharklasers.com','guerrillamailblock.com','guerrillamail.org',
      'guerrillamail.net','guerrillamail.de','guerrillamail.biz','grr.la','netmail.tk',
      'laste.ml','firste.ml','zeroe.ml','supere.ml','emlhub.com','emlpro.com','emltmp.com',
      'yomail.info','10mail.org','wegwerfmail.org','wegwerfmail.net','wegwerfmail.de',
      'trashmail.me','trashmail.io','trashmail.at','trash-mail.at','rcpt.at','proxymail.eu',
      'objectmail.com','kurzepost.de','damnthespam.com','contbay.com','0box.eu',
      'marmaryta.space','5y5u.com','58as.com','firemailbox.club','mozej.com','mailna.co',
      'mailna.in','mailna.me','mohmal.im','mohmal.in','yopmail.fr','yopmail.net',
      'cool.fr.nf','jetable.fr.nf','nospam.ze.tc','nomail.xl.cx','mega.zik.dj','speed.1s.fr',
      'courriel.fr.nf','moncourrier.fr.nf','monemail.fr.nf','monmail.fr.nf','nedoz.com',
      'nmagazinec.com','armyspy.com','vmani.com','discard.email','discardmail.com',
      'discardmail.de','spambog.com','spambog.de','spambog.ru','0btcmail.pw','815.ru',
      'knol-power.nl','hartbot.de','freundin.ru','smashmail.de','s0ny.net','pecinan.net',
      'budaya-tionghoa.com','lajoska.pe.hu','1mail.x24hr.com','from.onmypc.info',
      'now.mefound.com','mowgli.jungleheart.com','yourspamgoesto.space','pecinan.org',
      'budayationghoa.com','CR.cloudns.asia','TLS.cloudns.asia','MSFT.cloudns.asia',
      'B.cr.cloUdnS.asia','ssl.tls.cloudns.ASIA','sweetxxx.de','DVD.dns-cloud.net',
      'DVD.dnsabr.com','BD.dns-cloud.net','YX.dns-cloud.net','SHIT.dns-cloud.net',
      'SHIT.dnsabr.com','eu.dns-cloud.net','eu.dnsabr.com','asia.dnsabr.com',
      '8.dnsabr.com','pw.8.dnsabr.com','mm.8.dnsabr.com','23.8.dnsabr.com','pecinan.com',
      'disposable-email.ml','pw.epac.to','postheo.de','sexy.camdvr.org','Disposable.ml',
      '888.dnS-clouD.NET','adult-work.info','casinokun.hu','bangsat.in','wallus.casinokun.hu',
      'trap-mail.de','umailz.com','panchoalts.com','gmaile.design','ersatzauto.ch',
      'tempes.gq','cpmail.life','tempemail.info','coolmailcool.com','kittenemail.com',
      '99email.xyz','notmyemail.tech','m.cloudns.cl','twitter-sign-in.cf','anonymized.org',
      'you.has.dating','ketoblazepro.com','kost.party','0hio0ak.com','4dentalsolutions.com',
      't.woeishyang.com','ondemandemail.top','kittenemail.xyz','blackturtle.xyz',
      'y.x.ssl.cloudns.asia','geneseeit.com','mailg.ml','media.motornation.buzz',
      'sage.speedfocus.biz','badlion.co.uk','safeemail.xyz','virtual-generations.com',
      'new-york.host','mrdeeps.ml','kitela.work','fouadps.cf','megacorp.work','fake-wegwerf.email',
      'tigytech.com','historictheology.com','ma.567map.xyz','hotmailproduct.com','maxsize.online',
      'happyfreshdrink.com','denomla.com','pansamantala.poistaa.com','sahaltastari.sytes.net',
      'cecep.ddnsking.com','fadilmalik.ddnsking.com','csingi.sytes.net','richmail.ga','tikmail.gq',
      'bupkiss.ml','guerrillamail.info','pokemail.net','myinbox.icu','just4fun.me','inscriptio.in',
      'cloud-mail.top','safemail.icu','montokop.pw','tempamailbox.info','blogtron.com',
      'atanetorg.org','aristockphoto.com','jomcs.com','kukuka.org','gothill.com','mixely.com',
      'marsoasis.org','walmarteshop.com','outlandlabs.com','comectrix.com','buymondo.com',
      'eventao.com','louieliu.com','mymailnow.xyz','cuoly.com','getnada.com','abyssmail.com',
      'boximail.com','clrmail.com','dropjar.com','getairmail.com','givmail.com','inboxbear.com',
      'robot-mail.com','tafmail.com','vomoto.com','zetmail.com', 'yomail.info', 'yoo.ro', 'yopmail.com', 
      'yopmail.fr', 'yopmail.gq', 'yopmail.net', 'yopmail.pp.ua'];
    var email = value.split("@");
    var domain = email[1];
    //console.log("domain:"+domain);
    var valid=true;
    $.each(domain_restricted, function (key, value){
      if (value == domain) {
        valid = false;
      }
    });
    return valid;
  }, "Por favor, escribe una dirección de correo válida.");

  jQuery.validator.addMethod("rangelength", function (value, element, param) {
    //console.log("range:" + value);
    param[2]=value.length;
    return ((value.length >= param[0]) && (value.length <= param[1]));
  },
    "You are only allowed between {0} and {1}. You have typed {2} characters"
  ); 

  /**
  * Add Drupal behaviors
  */
  Drupal.behaviors.ABCPRegister = {
    attach: function () {
      $('#btn-submit').click(function() {
        var form = $('form');
        form.validate();
        if (form.valid()) {
          $('#edit-submit').mousedown();
        }
      });
    }
  };

  function validarCheckboxes() {
    var nuevoSpan = jQuery("<span>", {
      text: "Debes seleccionar una opción"
    })
    var nuevoSpanTwo = jQuery("<span>", {
      text: "Debes escribir una opción"
    })
    if (!$('input[type="checkbox"]:checked').length) {
      nuevoSpan.addClass("error error-checkbox");                                                          
      // Remover todos los mensajes de error previos
      jQuery(".error-checkbox").remove();
      // Agregar el nuevo mensaje de error
      jQuery("#edit-redes-sociales--wrapper").append(nuevoSpan);
    } else {
      // Si hay checkboxes seleccionados, eliminar el mensaje de error
      jQuery(".error-checkbox").remove();
    }
  }

  function validarCheckboxesinteres() {
    var nuevoSpan = jQuery("<span>", {
      text: "Debes seleccionar una opción"
    })
    var nuevoSpanTwo = jQuery("<span>", {
      text: "Debes escribir una opción"
    })
    if (!$('input[type="checkbox"]:checked').length) {
      nuevoSpan.addClass("error error-checkbox");                                                          
      // Remover todos los mensajes de error previos
      jQuery(".error-checkbox").remove();
      // Agregar el nuevo mensaje de error
      jQuery("#edit-redes-sociales--wrapper").append(nuevoSpan);
      jQuery("#edit-tema-de-preferencia--wrapper").append(nuevoSpan);
    } else {
      // Si hay checkboxes seleccionados, eliminar el mensaje de error
      jQuery(".error-checkbox").remove();
    }
  }

  // Llamar a la función en el evento submit
  jQuery('#webform-submission-registro-add-form').submit(function(event) {
      validarCheckboxes();
      validarCheckboxesinteres();
      // Si no hay errores, permitir el envío del formulario
      if (jQuery(".error-checkbox").length > 0) {
        event.preventDefault();
      }
  });

  // Llamar a la función en el evento change de los checkboxes
  jQuery('#edit-redes-sociales--wrapper input[type="checkbox"]').on('change', function() {
    validarCheckboxes();
  });

  // Llamar a la función en el evento change de los checkboxes
  jQuery('#edit-tema-de-preferencia--wrapper input[type="checkbox"]').on('change', function() {
    validarCheckboxesinteres();
  });

  function validarCorreoRepetido() {
    let nuevoSpan = jQuery("<span>", {
      text: "La dirección de correo que ingresaste ya fue registrada"
    })
    let email = jQuery('#edit-correo-electronico').val();
    $.ajax({
      url: "/ultima-hora-core/check-data/email",
      type: 'post',
      dataType: 'json',
      // data: {'email':email},
      success: function (response) {
        console.log(response);
        // $('#quiz').quiz({
        //   counterFormat: 'Pregunta %current de %total',
        //   questions: response
        // })
      },
      error: function(xhr, status) {
        console.log('se ha producido un error al cargar los datos de la trivia')
      }
    });	
  }

  //    // Llamar a la función en el evento submit
  //   //  jQuery('.webform-button--next').blur(function(event) {
  //   //   validarCorreoRepetido();
  //   //   // Si no hay errores, permitir el envío del formulario
  //   //   if (jQuery(".error-mail").length > 0) {
  //   //     event.preventDefault();
  //   //   }
  // });

  function gerpregunta(field,value,form) {
    jQuery
      .ajax({
        data: { field: field,value: value, form: form},
        type: "GET",
        url: "/uh/validate/validatepregunta",
      })
      .done(function (data, textStatus, jqXHR) {
        if (!data.hasError) {
          jQuery.each(data.pregunta, function (key, pregunta) {
            jQuery("label[for='edit-respuesta']").text("Tu pregunta de seguridad: "+ "¿"+pregunta['value']+"?");
           console.log(pregunta['value']);
          });
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        if (console && console.log) {
          console.log("La solicitud a fallado: " + textStatus);
        }
      });
  }

  jQuery("#edit-email").on("blur", function(){
    gerpregunta('correo_electronico', $('#edit-email').val(),'registro');
  });

})(jQuery);