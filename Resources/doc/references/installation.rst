Installation
============

*SiciarekJsTransBundle* can be installed at any moment during a project's lifecycle,
whether it's a clean Symfony2 installation or an existing project.


Downloading the code
--------------------

Use composer to manage your dependencies and download *SiciarekJsTransBundle*:

.. code-block:: bash

    php composer.phar require siciarek/ad-rotator-bundle

You'll be asked to type in a version constraint. 'dev-master' will get you the latest
version, compatible with the latest Symfony2 version.


Enabling *SiciarekJsTransBundle* and its dependencies
-----------------------------------------------------

Update your ``AppKernel.php`` file to enable SiciarekJsTransBundle:

.. code-block:: php

    // app/AppKernel.php
    public function registerBundles()
    {
        return array(
            // ...

            // Add SiciarekJsTransBundle
            new Sonata\AdminBundle\SiciarekJsTransBundle(),
            // ...
        );
    }

Configuring SiciarekJsTransBundle dependencies
------------------------------------------------

You will need to configure *SiciarekJsTransBundle's* dependencies by changing
your Symfony2 configuration in ``app/config/config.yml``.

uncomment:

.. code-block::	yaml

    translator:      { fallback: %locale% }

Cleaning up
-----------

Now, install the assets from the bundles:

.. code-block:: bash

    php app/console assets:install web

Usually, when installing new bundles, it's good practice to also delete your cache:

.. code-block:: bash

    php app/console cache:clear

At this point, you should be able to use *SiciarekJsTransBundle*.
