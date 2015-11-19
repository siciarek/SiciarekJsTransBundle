<?php

namespace Siciarek\JsTransBundle\Twig\Extension;

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
    public function translations($locs = array())
    {
        
        if (!$this->container->isScopeActive('request')) {
              return '';
        }
        
        $currlocale = $this->container->get('request')->getLocale();
        
        $directory = $this->container->get('kernel')->getCacheDir() . DIRECTORY_SEPARATOR . 'translations';

        if(!in_array($currlocale, $locs)) {
            $locs[] = $currlocale;
        }

        $catalogues = array();

        foreach($locs as $loc) {
            $this->container->get('translator')->trans(null, array(), null, $loc);
        }

        $finder = new Finder();
        $files = $finder->files()->in($directory)->name('/\.php$/');
        
        foreach($files as $file) {
            $script = $file->getRealPath();

            $loc = preg_replace('/.*catalogue\.([^\.]+)\..*/', '$1', $script);
            
            /**
             * @var \Symfony\Component\Translation\MessageCatalogue $catalogue
             */
            $catalogue = require $script;
            $catalogues[$loc] = $catalogue->all();
        }

        $json = json_encode($catalogues);

        $output = array();
        $output[] = '<script src="/bundles/siciarekjstrans/js/lib/xregexp.min.js"></script>';
        $output[] = sprintf('<script>String.prototype.locale = "%s";</script>', $currlocale);
        $output[] = sprintf('<script>String.prototype.translations = %s;</script>', $json);
        $output[] = '<script src="/bundles/siciarekjstrans/js/dist/trans.min.js"></script>';

        return implode("\n", $output);
    }
}
