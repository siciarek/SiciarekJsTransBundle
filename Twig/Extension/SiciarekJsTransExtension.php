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
    protected $loader;
    protected $generator;
    protected $textHelper;
    protected $container;

    public function __construct(FilesystemLoader $loader, UrlGeneratorInterface $generator, TextHelper $textHelper, Container $container)
    {
        $this->loader     = $loader;
        $this->generator  = $generator;
        $this->textHelper = $textHelper;
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
            'translations' => new \Twig_Function_Method($this, 'translations', array('needs_environment' => true, 'is_safe' => array('html'))),
        );
    }


    /**
     * Custom methods
     */
    public function translations(\Twig_Environment $twig)
    {
        set_time_limit(0);

        $currlocale = $this->container->get('templating.globals')->getRequest()->getLocale();


        $dirsOrder = array(
            "src",
            "app",
            "vendor",
        );

        // <cache>

        $directory = $this->container->get('kernel')->getCacheDir() . DIRECTORY_SEPARATOR . 'siciarek_js_trans';
        $extension    = ".dat";
        $cache = new \Doctrine\Common\Cache\FilesystemCache($directory, $extension);

        if(!$cache->contains('siciarek_js_trans')) {

            $project = $this->getContainer()->get('kernel')->getRootDir() . '/../';

            $temp = array();
            $finder = new Finder();

            $finder->files()->in($project)->path("translations")->name('*.yml');

            /**
             * @var \Symfony\Component\Finder\SplFileInfo $file
             */
            foreach ($finder as $file) {
                $path = preg_replace('|\\\\|', '/', $file->getRelativePath());
                $t    = explode('/', $path);
                $root = array_shift($t);

                list($namespace, $locale, $ext) = explode('.', $file->getFilename());

                $temp[$root][$path][$namespace][$locale] = Yaml::parse($file->getRealPath());
            }

            $cache->save('siciarek_js_trans', $temp);
        }

        $temp = $cache->fetch('siciarek_js_trans');

        // </cache>

        $dictionaries = array();

        foreach ($dirsOrder as $root) {
            foreach ($temp[$root] as $path => $data) {
                foreach ($data as $namespace => $dat) {
                    foreach ($dat as $loc => $trans) {
                        if ($loc == $currlocale) {
                            $dictionaries[$root][$namespace] = $trans;
                        }
                    }
                }
            }
        }

        return sprintf('<script>String.prototype.translations = %s;</script>', json_encode($dictionaries));
    }

    protected function getContainer()
    {
        return $this->container;
    }
}
