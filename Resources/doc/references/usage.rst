Usage
-----

Just add in your layout (just before first ``javascript`` tag is recommended):

.. code-block:: jinja

    {{ translations() }}

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

Usage of ``trans()``:

.. code-block:: javascript

    var message = "Not Found";

    mesage.trans();               // will return "Nie znaleziono"

    "Not Found".trans()           // will return "Nie znaleziono"


    message = "messages.not_found";

    message.trans();              // will return "Nie znaleziono"

    "messages.not_found".trans(); // will return "Nie znaleziono"


    message = "Hello, %user%!";

    mesage.trans({'%user%': 'John Doe'});          // will return "Witaj, John Doe!"

    "Hello, %user%!".trans({'%user%': 'John Doe'}) // will return "Witaj, John Doe!"


    message = "messages.hello_user";

    mesage.trans({'%user%': 'John Doe'});              // will return "Witaj, John Doe!"

    "messages.hello_user".trans({'%user%': 'John Doe'}) // will return "Witaj, John Doe!"



Usage of ``transchoice()``:

.. code-block:: javascript

    var message = '{0} There are no apples|{1} There is one apple|]1,Inf] There are %count% apples';

    mesage.transchoice(0);   // will return "There are no apples"

    mesage.transchoice(1);   // will return "There is one apple"

    mesage.transchoice(31);  // will return "There are 31 apples"