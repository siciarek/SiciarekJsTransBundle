<?php

namespace Siciarek\JsTransBundle\Twig\Extension;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Finder\Finder;

class SiciarekJsTransExtension extends \Twig_Extension
{

    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
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
        return [];
    }

    /**
     * Functions declaration
     */
    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('translations', [$this, 'translations'], ['is_safe' => ['html']]),
        ];
    }

    /**
     * Custom methods
     */
    public function translations($currlocale, $locs = array())
    {
        $directory = $this->container->get('kernel')->getCacheDir() . DIRECTORY_SEPARATOR . 'translations';

        if (!in_array($currlocale, $locs)) {
            $locs[] = $currlocale;
        }

        $catalogues = array();

        foreach ($locs as $loc) {
            $this->container->get('translator')->trans(null, array(), null, $loc);
        }

        $finder = new Finder();
        $files = $finder->files()->in($directory)->name('/\.php$/');

        foreach ($files as $file) {
            $script = $file->getRealPath();

            $loc = preg_replace('/.*catalogue\.([^\.]+)\..*/', '$1', $script);

            /**
             * @var \Symfony\Component\Translation\MessageCatalogue $catalogue
             */
            $catalogue = require $script;
            $catalogues[$loc] = $catalogue->all();
        }

        $json = json_encode($catalogues);

        $output = [];

        $output[] = sprintf('<script>String.prototype.locale = "%s";</script>', $currlocale);
        $output[] = sprintf('<script>String.prototype.translations = %s;</script>', $json);

        return implode("\n", $output);
    }

}
