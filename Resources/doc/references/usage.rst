Usage
-----

Just add in your layout (just before first ``javascript`` tag is recommended):

.. code-block:: jinja

    {{ translations() }}

If you want to use more locales than default one, you should give their names in table as an argument:

.. code-block:: jinja

    {{ translations([ 'fr', 'en' ]) }}

Now you have enabled two custom methods of javascript ``String`` object:

.. code-block:: javascript

    String.trans(arguments, domain, locale);
    String.transchoice(count, arguments, domain, locale);

Both are javascript ports of, respectively, ``trans`` and ``transchoice`` Twig filters.

If you have specified for example in ``Resources\translations\messages.pl.yaml``

.. code-block:: yaml

    Not Found: Nie znaleziono
    Hello, %user%!: Witaj, %user%!

    '{0} There are no apples|{1} There is one apple|]1,Inf] There are %count% apples': '{0} There are no apples|{1} There is one apple|]1,Inf] There are %count% apples'

    messages:
       not_found: Nie znaleziono
       hello_user: Witaj, %user%!


Than you can do in your ``javascript`` code:


Sample usage of ``trans()``
===========================

.. code-block:: javascript

    var message = "Not Found";

    message.trans();               // will result in "Nie znaleziono"

    "Not Found".trans()           // will result in "Nie znaleziono"


    message = "messages.not_found";

    message.trans();              // will result in "Nie znaleziono"

    "messages.not_found".trans(); // will result in "Nie znaleziono"


    message = "Hello, %user%!";

    message.trans({'%user%': 'John Doe'});          // will result in "Witaj, John Doe!"

    "Hello, %user%!".trans({'%user%': 'John Doe'}) // will result in "Witaj, John Doe!"


    message = "messages.hello_user";

    message.trans({'%user%': 'John Doe'});               // will result in "Witaj, John Doe!"

    "messages.hello_user".trans({'%user%': 'John Doe'}) // will result in "Witaj, John Doe!"


Current locale value is used by default. If you want to force specific locale in translation, use ``locale`` parameter.

If you have defined

in ``Resources\translations\messages.en.yaml``

.. code-block:: yaml

    dummy:
        count: one two three

in ``Resources\translations\messages.fr.yaml``

.. code-block:: yaml

    dummy:
        count: un deux trois

in ``Resources\translations\messages.pl.yaml``

.. code-block:: yaml

    dummy:
        count: raz dwa trzy


And you do:

.. code-block:: javascript

    var message = 'dummy.count';

    message.trans();               // will result in default locale translation

    message.trans({}, null, 'en'); // will result in "one two three"

    message.trans({}, null, 'fr'); // will result in "un deux trois"

    message.trans({}, null, 'pl'); // will result in "raz dwa trzy"


Sample usage of ``trans()``
===========================

.. code-block:: javascript

    var message = '{0} There are no apples|{1} There is one apple|]1,Inf] There are %count% apples';

    mesage.transchoice(0);   // will result in "There are no apples"

    mesage.transchoice(1);   // will result in "There is one apple"

    mesage.transchoice(31);  // will result in "There are 31 apples"


Tests
=====

``QUnit`` test suite is available /bundles/siciarekjstrans/js/qunit/index.html.




