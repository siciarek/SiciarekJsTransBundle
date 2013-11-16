<?php

namespace Siciarek\JsTransBundle\Twig\Extension;

use EWZ\Bundle\TextBundle\Templating\Helper\TextHelper;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Bundle\TwigBundle\Loader\FilesystemLoader;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Yaml\Yaml;


class SiciarekJsTransExtension extends \Twig_Extension
{
    protected $container;

    public function __construct(Container $container)
    {
        $this->container  = $container;
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'siciarek_js_trans_twig_extension';
    }

    /**
     * Filters declaration
     */
    public function getFilters()
    {
        return array();
    }

    /**
     * Functions declaration
     */
    public function getFunctions()
    {
        return array(
            'translations' => new \Twig_Function_Method($this, 'translations', array('is_safe' => array('html'))),
        );
    }


    /**
     * Custom methods
     */
    public function translations()
    {
        $currlocale = $this->container->get('templating.globals')->getRequest()->getLocale();
        $directory = $this->container->get('kernel')->getCacheDir() . DIRECTORY_SEPARATOR . 'translations';
        $script = sprintf('%s%scatalogue.%s.php', $directory, DIRECTORY_SEPARATOR, $currlocale);

        $this->container->get('translator')->trans(null);

        /**
         * @var \Symfony\Component\Translation\MessageCatalogue $catalogue
         */
        $catalogue = require $script;

        return sprintf('<script>String.prototype.locale = "%s"; String.prototype.translations = %s;</script>', $currlocale, json_encode(array($currlocale => $catalogue->all())));
    }
}
